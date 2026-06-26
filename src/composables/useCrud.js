import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function useCrud(tableName, { orderBy = 'created_at', ascending = false } = {}) {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  function clearError() {
    error.value = null
  }

  async function fetchAll(filters = {}) {
    try {
      loading.value = true
      error.value = null

      let query = supabase.from(tableName).select('*')

      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value)
      }

      query = query.order(orderBy, { ascending })

      const { data, error: err } = await query
      if (err) throw err

      items.value = data || []
      return items.value
    } catch (err) {
      error.value = err.message
      console.error(`Error fetching ${tableName}:`, err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Error fetching ${tableName} by id:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(record) {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Error creating ${tableName}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id, updates) {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error(`Error updating ${tableName}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    try {
      loading.value = true
      error.value = null

      const { error: err } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (err) throw err
      return true
    } catch (err) {
      error.value = err.message
      console.error(`Error deleting ${tableName}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    clearError,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
  }
}
