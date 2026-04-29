import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PETS, affectionTier } from '../data/pets.js'
import { ACCESSORIES_BY_ID } from '../data/accessories.js'

const todayKey = () => new Date().toISOString().slice(0, 10)

const initialPetState = () =>
  Object.fromEntries(
    PETS.map((p) => [
      p.id,
      {
        affection: 0,
        ownedAccessories: [],
        equipped: [],
        lastFedAt: null,
        evolved: false,
      },
    ])
  )

export const useStore = create(
  persist(
    (set, get) => ({
      // —— 全域 ——
      activePetId: 'fire',
      foodCount: 3, // 起始送 3 飼料以便初次體驗
      streakDays: 0,
      lastCompleteDate: null,
      pets: initialPetState(),
      sessions: [], // 練習排程
      treasureLog: [], // 尋寶歷史

      // —— 切換 ——
      setActivePet: (id) => set({ activePetId: id }),

      // —— 練習排程 ——
      addSession: (s) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              status: 'pending',
              ...s,
            },
          ],
        })),
      removeSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((x) => x.id !== id) })),
      completeSession: (id, accuracy) =>
        set((state) => {
          const s = state.sessions.find((x) => x.id === id)
          if (!s) return {}
          const updated = state.sessions.map((x) =>
            x.id === id
              ? { ...x, status: 'completed', completedAt: new Date().toISOString(), accuracy }
              : x
          )
          // 連勝計算
          const today = todayKey()
          let streak = state.streakDays
          if (state.lastCompleteDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
            streak = state.lastCompleteDate === yesterday ? streak + 1 : 1
          }
          return {
            sessions: updated,
            foodCount: state.foodCount + 1,
            streakDays: streak,
            lastCompleteDate: today,
          }
        }),

      // —— 補做 ——
      makeupSession: (id, accuracy) =>
        set((state) => {
          const updated = state.sessions.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: 'makeup',
                  completedAt: new Date().toISOString(),
                  accuracy,
                  isMakeup: true,
                }
              : x
          )
          return {
            sessions: updated,
            foodCount: state.foodCount + 1,
          }
        }),

      // —— 寵物互動 ——
      feedPet: (petId) =>
        set((state) => {
          if (state.foodCount <= 0) return {}
          const pet = state.pets[petId]
          return {
            foodCount: state.foodCount - 1,
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                affection: Math.min(pet.affection + 2, 30),
                lastFedAt: new Date().toISOString(),
              },
            },
          }
        }),
      playWith: (petId) =>
        set((state) => {
          const pet = state.pets[petId]
          return {
            pets: {
              ...state.pets,
              [petId]: { ...pet, affection: Math.min(pet.affection + 1, 30) },
            },
          }
        }),

      // —— 尋寶 ——
      grantAccessory: (petId, accessoryId) =>
        set((state) => {
          const pet = state.pets[petId]
          if (pet.ownedAccessories.includes(accessoryId)) {
            return {
              treasureLog: [
                {
                  at: new Date().toISOString(),
                  petId,
                  accessoryId,
                  duplicate: true,
                },
                ...state.treasureLog,
              ].slice(0, 50),
            }
          }
          return {
            pets: {
              ...state.pets,
              [petId]: {
                ...pet,
                ownedAccessories: [...pet.ownedAccessories, accessoryId],
              },
            },
            treasureLog: [
              { at: new Date().toISOString(), petId, accessoryId, duplicate: false },
              ...state.treasureLog,
            ].slice(0, 50),
          }
        }),
      toggleEquip: (petId, accessoryId) =>
        set((state) => {
          const pet = state.pets[petId]
          const owned = pet.ownedAccessories.includes(accessoryId)
          if (!owned) return {}
          let equipped = pet.equipped.includes(accessoryId)
            ? pet.equipped.filter((x) => x !== accessoryId)
            : [...pet.equipped, accessoryId]
          // 上限：依親密度等級給欄位（Lv1=1, Lv2=2, Lv3+=3）
          const tier = affectionTier(pet.affection)
          const slots = Math.min(3, Math.max(1, tier.level - 0))
          if (equipped.length > slots) equipped = equipped.slice(equipped.length - slots)
          return {
            pets: {
              ...state.pets,
              [petId]: { ...pet, equipped },
            },
          }
        }),

      // —— 取用 ——
      isTreasureUnlocked: (petId) => {
        const pet = get().pets[petId]
        return pet.affection >= 20
      },

      // —— 重置（debug） ——
      reset: () =>
        set({
          activePetId: 'fire',
          foodCount: 3,
          streakDays: 0,
          lastCompleteDate: null,
          pets: initialPetState(),
          sessions: [],
          treasureLog: [],
        }),
    }),
    {
      name: 'alien-pets-v0.1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// —— 日期工具 ——
export function dateOnly(iso) {
  return iso?.slice(0, 10)
}

export function isPast(session) {
  const now = new Date()
  const dt = new Date(`${session.date}T${session.time}:00`)
  return dt.getTime() < now.getTime() - 2 * 3600 * 1000 // 2 小時後算過期
}

export function classifySession(session) {
  if (session.status === 'completed' || session.status === 'makeup') return 'done'
  if (isPast(session)) return 'missed'
  return 'pending'
}

export { ACCESSORIES_BY_ID }
