import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SelectInput from '@/components/SelectInput.vue'

const mockOptions = [
  { name: 'Slovakia', code: 'sk', id: 1 },
  { name: 'Czech Republic', code: 'cz', id: 2 },
  { name: 'Poland', code: 'pl', id: 3 },
]

describe('SelectInput.vue', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(SelectInput, {
      props: { options: mockOptions, modelValue: '' },
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('updates modelValue when typing', async () => {
    const wrapper = mount(SelectInput, {
      props: { options: mockOptions, modelValue: '' },
    })
    const input = wrapper.find('input')
    await input.setValue('Slo')
    expect(wrapper.find('input').element.value).toBe('Slo')
  })

  it('shows suggestions when typing', async () => {
    const wrapper = mount(SelectInput, {
      props: { options: mockOptions, modelValue: '' },
    })
    const input = wrapper.find('input')
    await input.setValue('va')
    // todo - try define expose
    // expect(wrapper.vm.showSuggestions).toBe(true);
    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBeGreaterThan(0)
  })

  it('selects an option when clicked', async () => {
    const wrapper = mount(SelectInput, {
      props: { options: mockOptions, modelValue: '' },
    })
    await wrapper.find('input').setValue('Slo')
    await wrapper.find('li').trigger('mousedown')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Slovakia'])
  })

  it('clears input when clear button is clicked', async () => {
    const wrapper = mount(SelectInput, {
      props: { options: mockOptions, modelValue: 'Slovakia' },
    })
    await wrapper.find('.clear-button').trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([''])
  })

  it('hides suggestions when input loses focus', async () => {
    const wrapper = mount(SelectInput, {
      props: { options: mockOptions, modelValue: '' },
    })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('blur')
    setTimeout(() => {
      expect(wrapper.find('ul').exists()).toBe(false)
    }, 300)
  })
})
