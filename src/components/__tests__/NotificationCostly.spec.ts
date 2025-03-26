import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Notification from '@/components/common/NotificationCostly.vue'
import { nextTick } from 'vue'

describe('Notification Component', () => {
  const createWrapper = (props = {}) => {
    return mount(Notification, {
      props: {
        message: 'Test message',
        ...props,
      },
    })
  }

  describe('Rendering', () => {
    it('renders the notification when message is provided', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.notification').exists()).toBe(true)
      expect(wrapper.find('.notification-message').text()).toBe('Test message')
    })

    it('does not render when message is empty', () => {
      const wrapper = createWrapper({ message: '' })
      expect(wrapper.find('.notification').isVisible()).toBe(false)
    })
  })

  describe('Props Validation', () => {
    it('renders with default type (success)', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.notification').classes()).toContain('success')
    })

    it('applies correct class for error type', () => {
      const wrapper = createWrapper({ type: 'error' })
      expect(wrapper.find('.notification').classes()).toContain('error')
    })

    it('applies correct class for default type', () => {
      const wrapper = createWrapper({ type: 'default' })
      expect(wrapper.find('.notification').classes()).toContain('default')
    })

    it('throws warning for invalid type', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      createWrapper({ type: 'invalid' })

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-live attribute', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
    })
  })

  describe('Transition Behavior', () => {
    it('applies transition classes', async () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.notification').isVisible()).toBe(true)

      await wrapper.setProps({ message: '' })
      await nextTick()

      expect(wrapper.find('.slide-fade-leave-active').exists()).toBe(true)
    })
  })

  // describe('Snapshot Testing', () => {
  //   it('matches snapshot for success type', () => {
  //     const wrapper = createWrapper()
  //     expect(wrapper.html()).toMatchSnapshot()
  //   })
  //
  //   it('matches snapshot for error type', () => {
  //     const wrapper = createWrapper({ type: 'error' })
  //     expect(wrapper.html()).toMatchSnapshot()
  //   })
  // })
})
