import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia, type TestingPinia } from '@pinia/testing'
import SignUp from '@/components/SignUp.vue'
import { useModalStore } from '@/stores/modalsStore'
import { vi } from 'vitest'

describe('SignUp.vue', () => {
  let pinia: TestingPinia
  let modalsStore

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    modalsStore = useModalStore(pinia)
    modalsStore.isOpen = true
  })

  it('renders the component correctly', () => {
    const wrapper = mount(SignUp, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.find('h2').text()).toBe('Welcome to CostlyAI')
    expect(wrapper.find('.type .sign-in').text()).toBe('Sign In')
    expect(wrapper.find('.type .sign-up').text()).toBe('Sign Up')
  })

  it('validates email input correctly', async () => {
    const wrapper = mount(SignUp, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.find('#email input').setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error').text()).toBe('Email is invalid')
  })

  it('validates password input correctly', async () => {
    const wrapper = mount(SignUp, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.find('#password input').setValue('short')
    await wrapper.find('form').trigger('submit.prevent')

    const errors = wrapper.findAll('.error')
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].text()).toContain('Email is required')
  })
})
