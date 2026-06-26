import { ref, computed } from 'vue'

const currentView = ref('projects')
const selectedProject = ref(null)
const selectedSuite = ref(null)
const selectedSubSuite = ref(null)
const selectedTestCase = ref(null)

const breadcrumbs = computed(() => {
  const crumbs = [{ label: 'Projects', view: 'projects', item: null }]

  if (selectedProject.value) {
    crumbs.push({
      label: selectedProject.value.name,
      view: 'suites',
      item: selectedProject.value,
    })
  }

  if (selectedSuite.value) {
    crumbs.push({
      label: selectedSuite.value.name,
      view: 'sub_suites',
      item: selectedSuite.value,
    })
  }

  if (selectedSubSuite.value) {
    crumbs.push({
      label: selectedSubSuite.value.name,
      view: 'test_cases',
      item: selectedSubSuite.value,
    })
  }

  if (selectedTestCase.value) {
    crumbs.push({
      label: selectedTestCase.value.title,
      view: 'test_case_detail',
      item: selectedTestCase.value,
    })
  }

  return crumbs
})

export function useNavigation() {
  function navigateTo(view) {
    if (view === 'projects') {
      selectedProject.value = null
      selectedSuite.value = null
      selectedSubSuite.value = null
      selectedTestCase.value = null
    } else if (view === 'suites') {
      selectedSuite.value = null
      selectedSubSuite.value = null
      selectedTestCase.value = null
    } else if (view === 'sub_suites') {
      selectedSubSuite.value = null
      selectedTestCase.value = null
    } else if (view === 'test_cases') {
      selectedTestCase.value = null
    }
    currentView.value = view
  }

  function openProject(project) {
    selectedProject.value = project
    currentView.value = 'suites'
  }

  function openSuite(suite) {
    selectedSuite.value = suite
    currentView.value = 'sub_suites'
  }

  function openSubSuite(subSuite) {
    selectedSubSuite.value = subSuite
    currentView.value = 'test_cases'
  }

  function openTestCase(testCase) {
    selectedTestCase.value = testCase
    currentView.value = 'test_case_detail'
  }

  return {
    currentView,
    selectedProject,
    selectedSuite,
    selectedSubSuite,
    selectedTestCase,
    breadcrumbs,
    navigateTo,
    openProject,
    openSuite,
    openSubSuite,
    openTestCase,
  }
}
