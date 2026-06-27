import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

/**
 * CRUD composable backed by Supabase/Postgres.
 *
 * Postgres best practices applied (see .agents/skills/supabase-postgres-best-practices):
 *  - `columns`: select only what each view renders instead of `select('*')` (covering-index friendly, less data over the wire).
 *  - `pageSize` + `loadMore()`: cursor/keyset pagination (O(1) at any depth) instead of loading the whole table.
 */
export function useCrud(tableName, {
  columns = '*',
  orderBy = 'created_at',
  ascending = false,
  pageSize = null,
} = {}) {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(false)

  function clearError() {
    error.value = null
  }

  // Build the select/filter/order/cursor chain shared by fetchAll and loadMore.
  function buildQuery({ columns: cols = columns, filters = {}, cursor = null, limit = pageSize } = {}) {
    let query = supabase.from(tableName).select(cols)

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value)
    }

    // Keyset cursor: continue strictly after the last seen value of `orderBy`.
    // NOTE: single-column cursor (per data-pagination rule). If rows can share the
    // same `orderBy` value, switch the order key to a unique column (e.g. `id`).
    if (cursor !== null && cursor !== undefined) {
      query = ascending ? query.gt(orderBy, cursor) : query.lt(orderBy, cursor)
    }

    if (limit) {
      query = query.limit(limit + 1) // fetch one extra to detect a next page
    }

    return query.order(orderBy, { ascending })
  }

  function applyPage(data, limit) {
    if (limit && data.length > limit) {
      hasMore.value = true
      return data.slice(0, limit)
    }
    hasMore.value = false
    return data || []
  }

  async function fetchAll(filters = {}, opts = {}) {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await buildQuery({ filters, ...opts })
      if (err) throw err

      items.value = applyPage(data || [], opts.limit ?? pageSize)
      return items.value
    } catch (err) {
      error.value = err.message
      console.error(`Error fetching ${tableName}:`, err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function loadMore(filters = {}, opts = {}) {
    if (!hasMore.value || loading.value || items.value.length === 0) return

    const last = items.value[items.value.length - 1]
    const cursor = last?.[orderBy]
    if (cursor === undefined) return

    try {
      loading.value = true
      const { data, error: err } = await buildQuery({ filters, cursor, ...opts })
      if (err) throw err

      const page = applyPage(data || [], opts.limit ?? pageSize)
      items.value = [...items.value, ...page]
      return items.value
    } catch (err) {
      error.value = err.message
      console.error(`Error loading more ${tableName}:`, err)
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
        .select('*') // detail view needs every column
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
    hasMore,
    clearError,
    fetchAll,
    loadMore,
    fetchOne,
    create,
    update,
    remove,
  }
}
