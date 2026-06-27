import { ref, computed } from 'vue'

const currentView = ref('projects')
const currentProject = ref(null)
const currentSuite = ref(null)
const currentSubSuite = ref(null)
const currentTestCase = ref(null)

const breadcrumbs = computed(() => {
  const crumbs = [{ label: 'Projects', view: 'projects', item: null }]

  if (currentProject.value) {
    crumbs.push({
      label: currentProject.value.name,
      view: 'suites',
      item: currentProject.value,
    })
  }

  if (currentSuite.value) {
    crumbs.push({
      label: currentSuite.value.name,
      view: 'sub_suites',
      item: currentSuite.value,
    })
  }

  if (currentSubSuite.value) {
    crumbs.push({
      label: currentSubSuite.value.name,
      view: 'test_cases',
      item: currentSubSuite.value,
    })
  }

  if (currentTestCase.value) {
    crumbs.push({
      label: currentTestCase.value.title,
      view: 'test_case_detail',
      item: currentTestCase.value,
    })
  }

  return crumbs
})

export function useNavigation() {
  function navigateTo(view) {
    if (view === 'projects') {
      currentProject.value = null
      currentSuite.value = null
      currentSubSuite.value = null
      currentTestCase.value = null
    } else if (view === 'suites') {
      currentSuite.value = null
      currentSubSuite.value = null
      currentTestCase.value = null
    } else if (view === 'sub_suites') {
      currentSubSuite.value = null
      currentTestCase.value = null
    } else if (view === 'test_cases') {
      currentTestCase.value = null
    }
    currentView.value = view
  }

  function openProject(project) {
    currentProject.value = project
    currentView.value = 'suites'
  }

  function openSuite(suite) {
    currentSuite.value = suite
    currentView.value = 'sub_suites'
  }

  function openSubSuite(subSuite) {
    currentSubSuite.value = subSuite
    currentView.value = 'test_cases'
  }

  function openTestCase(testCase) {
    currentTestCase.value = testCase
    currentView.value = 'test_case_detail'
  }

  return {
    currentView,
    currentProject,
    currentSuite,
    currentSubSuite,
    currentTestCase,
    breadcrumbs,
    navigateTo,
    openProject,
    openSuite,
    openSubSuite,
    openTestCase,
  }
}
