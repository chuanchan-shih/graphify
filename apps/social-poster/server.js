require('dotenv').config()
const express = require('express')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const app = express()
const upload = multer({ dest: 'uploads/' })

app.use(express.static('public'))
app.use(express.json())

const {
  FB_PAGE_ID,
  FB_PAGE_ACCESS_TOKEN,
  IG_USER_ID,
  PORT = 3000,
} = process.env

// —— 發文到 Facebook Page ——
async function postToFacebook(imagePath, caption) {
  // 1. 上傳圖片
  const form = new FormData()
  form.append('source', fs.createReadStream(imagePath))
  form.append('caption', caption)
  form.append('access_token', FB_PAGE_ACCESS_TOKEN)
  const res = await axios.post(
    `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/photos`,
    form,
    { headers: form.getHeaders() }
  )
  return res.data
}

// —— 發文到 Instagram ——
async function postToInstagram(imagePath, caption) {
  // IG 需要公開 URL；用 FB 先上傳圖片取得公開連結
  const form = new FormData()
  form.append('source', fs.createReadStream(imagePath))
  form.append('published', 'false') // 先暫存，不公開
  form.append('access_token', FB_PAGE_ACCESS_TOKEN)
  const uploadRes = await axios.post(
    `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/photos`,
    form,
    { headers: form.getHeaders() }
  )
  const fbPhotoId = uploadRes.data.id

  // 取得這張圖的公開 URL
  const urlRes = await axios.get(
    `https://graph.facebook.com/v21.0/${fbPhotoId}`,
    { params: { fields: 'images', access_token: FB_PAGE_ACCESS_TOKEN } }
  )
  const imageUrl = urlRes.data.images[0].source

  // 建立 IG media container
  const containerRes = await axios.post(
    `https://graph.facebook.com/v21.0/${IG_USER_ID}/media`,
    null,
    {
      params: {
        image_url: imageUrl,
        caption,
        access_token: FB_PAGE_ACCESS_TOKEN,
      },
    }
  )
  const creationId = containerRes.data.id

  // 等 IG 處理圖片（最多 30 秒）
  await waitForReady(creationId)

  // 發布
  const publishRes = await axios.post(
    `https://graph.facebook.com/v21.0/${IG_USER_ID}/media_publish`,
    null,
    {
      params: {
        creation_id: creationId,
        access_token: FB_PAGE_ACCESS_TOKEN,
      },
    }
  )
  return publishRes.data
}

async function waitForReady(creationId, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const res = await axios.get(
      `https://graph.facebook.com/v21.0/${creationId}`,
      { params: { fields: 'status_code', access_token: FB_PAGE_ACCESS_TOKEN } }
    )
    if (res.data.status_code === 'FINISHED') return
    if (res.data.status_code === 'ERROR') throw new Error('IG 圖片處理失敗')
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error('IG 圖片處理逾時')
}

// —— API 端點 ——
app.post('/api/post', upload.single('image'), async (req, res) => {
  const { caption, targets } = req.body
  const image = req.file
  if (!image) return res.status(400).json({ error: '請上傳圖片' })
  if (!caption?.trim()) return res.status(400).json({ error: '請填寫文案' })

  const targetList = Array.isArray(targets) ? targets : [targets].filter(Boolean)
  const results = {}
  const errors = {}

  try {
    if (targetList.includes('facebook')) {
      try {
        results.facebook = await postToFacebook(image.path, caption)
      } catch (e) {
        errors.facebook = e.response?.data?.error?.message || e.message
      }
    }
    if (targetList.includes('instagram')) {
      try {
        results.instagram = await postToInstagram(image.path, caption)
      } catch (e) {
        errors.instagram = e.response?.data?.error?.message || e.message
      }
    }
  } finally {
    // 刪除暫存圖片
    fs.unlink(image.path, () => {})
  }

  const hasSuccess = Object.keys(results).length > 0
  const hasError = Object.keys(errors).length > 0
  res.json({ results, errors, ok: hasSuccess })
})

// —— 健康檢查 ——
app.get('/api/config-check', (_req, res) => {
  res.json({
    fb_page_id: FB_PAGE_ID ? '✅ 已設定' : '❌ 未設定',
    fb_token: FB_PAGE_ACCESS_TOKEN ? '✅ 已設定' : '❌ 未設定',
    ig_user_id: IG_USER_ID ? '✅ 已設定' : '❌ 未設定',
  })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Social Poster 啟動 → http://localhost:${PORT}\n`)
})
