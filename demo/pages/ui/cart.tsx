import { NextPage } from 'next'
import { CartPopover, useDynamicTokens } from '@reservoir0x/reservoir-kit-ui'
import { useContext, useState } from 'react'
import ThemeSwitcher from 'components/ThemeSwitcher'
import { usePrivy } from '@privy-io/react-auth'
import ChainSwitcher from 'components/ChainSwitcher'
import { ChainSwitcherContext } from 'pages/_app'

const DEFAULT_COLLECTION_ID =
  process.env.NEXT_PUBLIC_DEFAULT_COLLECTION_ID ||
  '0xe14fa5fba1b55946f2fa78ea3bd20b952fa5f34e'

const CartPage: NextPage = () => {
  const { login } = usePrivy()
  const [collectionId, setCollectionId] = useState(DEFAULT_COLLECTION_ID)
  const [orderId, setOrderId] = useState('')
    const { chain } = useContext(ChainSwitcherContext)

  const {
    data: tokens,
    remove,
    add,
  } = useDynamicTokens(
    collectionId
      ? {
          collection: collectionId,
          limit: 100,
          includeDynamicPricing: true,
          includeQuantity: true,
        }
      : false
  )

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        gap: 12,
        padding: 24,
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
      }}
    >
      <CartPopover
        trigger={<button>Cart</button>}
        onConnectWallet={() => {
          login?.()
        }}
      />
      <div>
        <i>
          Add ?cartFeeBps=["0xabc:123"] or ?cartFeeUsd=["0xabc:1000000"] to add
          a fee to the cart
        </i>
      </div>
      <div>
        <label>Collection Id: </label>
        <input
          placeholder="Collection Id"
          type="text"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      <div>
        <label>Add by Order Id: </label>
        <input
          placeholder="Order Id"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ width: 250 }}
        />
        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            add([{ orderId: orderId }], Number(chain))
          }}
        >
          Add to cart
        </button>
      </div>
      {tokens.map((token) => {
        return (
          <div key={token?.token?.tokenId} style={{ display: 'flex', gap: 12 }}>
            <input
              type="checkbox"
              checked={token.isInCart}
              onChange={() => {}}
              onClick={() => {
                if (!token?.token || !token.token.collection?.id || !chain) {
                  return
                }

                if (token.isInCart) {
                  remove([
                    `${token.token.collection.id}:${token.token.tokenId}`,
                  ])
                } else {
                  add([token], chain)
                }
              }}
            />
            <div>
              <div>
                Name: {token?.token?.name} - {token?.token?.tokenId}
              </div>
              <div>Price: {token.market?.floorAsk?.price?.amount?.decimal}</div>
            </div>
          </div>
        )
      })}
      <ThemeSwitcher />
      <ChainSwitcher />
    </div>
  )
}

export default CartPage
