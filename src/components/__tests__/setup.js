import { config } from '@vue/test-utils'
config.global.stubs = {
  Teleport: {
    template: '<div><slot /></div>',
  },
}
