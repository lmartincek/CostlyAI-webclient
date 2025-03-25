import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TagCostly from '@/components/common/TagCostly.vue'

describe('TagCostly.vue', () => {
  let wrapper: ReturnType<typeof mount>

  const createWrapper = (props = {}, slots = {}) => {
    return mount(TagCostly, {
      props: {
        ...props,
      },
      slots: {
        default: 'Default Tag',
        ...slots,
      },
    })
  }

  beforeEach(() => {
    if (wrapper) wrapper.unmount()
  })

  it('renders the default tag with no props or slots', () => {
    wrapper = createWrapper()

    expect(wrapper.text()).toContain('Default Tag')
    expect(wrapper.classes()).toContain('tag')
    expect(wrapper.classes()).not.toContain('tag-add')
    expect(wrapper.classes()).not.toContain('selected')
    expect(wrapper.classes()).not.toContain('disabled')
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })

  it('renders the tag with an icon slot and verifies its placement', () => {
    wrapper = createWrapper({}, { icon: '<span class="test-icon">Icon</span>' })

    const icon = wrapper.find('.icon')
    expect(icon.exists()).toBe(true)
    expect(icon.find('.test-icon').exists()).toBe(true)
    expect(icon.text()).toBe('Icon')
    expect(wrapper.find('.tag-content').text()).toBe('Default Tag')
  })

  it('renders the add tag variant and verifies the add icon', () => {
    wrapper = createWrapper({ isAddTag: true })

    expect(wrapper.classes()).toContain('tag-add')
    expect(wrapper.find('.tag-add-icon').exists()).toBe(true)
    expect(wrapper.find('.tag-add-icon').text()).toBe('+')
  })

  it('toggles the selected state on click and verifies emitted events', async () => {
    wrapper = createWrapper()

    expect(wrapper.classes()).not.toContain('selected')
    expect(wrapper.attributes('aria-pressed')).toBe('false')

    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('selected')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.emitted('update:isSelected')).toBeTruthy()
    expect(wrapper.emitted('update:isSelected')?.[0]).toEqual([true])

    await wrapper.trigger('click')
    expect(wrapper.classes()).not.toContain('selected')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.emitted('update:isSelected')?.[1]).toEqual([false])
  })

  it('does not toggle the selected state when disabled', async () => {
    wrapper = createWrapper({ disabled: true })

    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.classes()).not.toContain('selected')

    await wrapper.trigger('click')
    expect(wrapper.classes()).not.toContain('selected')
    expect(wrapper.emitted('update:isSelected')).toBeFalsy()
  })

  it('does not apply the disabled class when selected', async () => {
    wrapper = createWrapper({ disabled: true })

    expect(wrapper.classes()).toContain('disabled')

    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.classes()).not.toContain('selected')
  })

  it('updates aria-pressed correctly when selected', async () => {
    wrapper = createWrapper()

    expect(wrapper.attributes('aria-pressed')).toBe('false')

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-pressed')).toBe('true')

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })

  it('overrides default slot content when custom content is provided', () => {
    wrapper = createWrapper({}, { default: 'Custom Tag Content' })

    expect(wrapper.text()).toContain('Custom Tag Content')
    expect(wrapper.text()).not.toContain('Default Tag')
  })

  it('handles multiple clicks in rapid succession correctly', async () => {
    wrapper = createWrapper()

    await wrapper.trigger('click')
    await wrapper.trigger('click')
    await wrapper.trigger('click')

    expect(wrapper.classes()).toContain('selected')
    expect(wrapper.emitted('update:isSelected')).toHaveLength(3)
    expect(wrapper.emitted('update:isSelected')).toEqual([[true], [false], [true]])
  })
})
