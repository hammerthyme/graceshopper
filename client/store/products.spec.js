import {expect} from 'chai'
import {me, logout} from './user'
import {getAllProducts, getSingleProduct} from './products'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('thunk creators', () => {
  let store
  let mockAxios

  const initialState = {
    products: [],
    selectedProduct: {}
  }

  beforeEach(() => {
    mockAxios = new MockAdapter(axios)
    store = mockStore(initialState)
  })

  afterEach(() => {
    mockAxios.restore()
    store.clearActions()
  })
  describe('get all products state', () => {
    it('eventually dispatched the RECEIVE ALL PRODUCTS action', async () => {
      const fakeProduct = require('../../testData/products')
      mockAxios.onGet('/api/products').replyOnce(200, fakeProduct)
      await store.dispatch(getAllProducts())
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('RECEIVE_PRODUCTS')
      expect(actions[0].payload).to.be.deep.equal(fakeProduct)
    })
  })
  describe('get selected product state', () => {
    it('eventually dispatched the RECEIVED SINGLE PRODUCT action', async () => {
      const testProduct = require('../../testData/products').products[0]
      console.log('testProduct', testProduct)
      mockAxios.onGet('/api/products/1').replyOnce(200, testProduct)
      await store.dispatch(getSingleProduct(1))
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('RECEIVE_SINGLE_PRODUCT')
      expect(actions[0].payload).to.be.deep.equal(testProduct)
    })
  })
})
