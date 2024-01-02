import React, { FC } from 'react'
import {
  Flex,
  FormatCryptoCurrency,
  FormatCurrency,
  Img,
  Text,
} from '../primitives'
import { useCollections, useTokens } from '../hooks'
import { PaymentToken } from '@reservoir0x/reservoir-sdk'

enum Size {
  SM,
  LG,
}

type Props = {
  collection?: NonNullable<ReturnType<typeof useCollections>['data']>[0]
  token?: NonNullable<ReturnType<typeof useTokens>['data']>[0]
  itemCount: number
  totalPrice: bigint
  usdTotalFormatted?: number | string
  currency?: PaymentToken
  size?: Size
  chainId?: number
}

export const PurchaseCheckout: FC<Props> = ({
  collection,
  token,
  itemCount,
  totalPrice,
  chainId,
  usdTotalFormatted,
  currency,
}) => {
  const itemSubject = itemCount === 1 ? 'item' : 'items'

  return (
    <Flex direction="column">
      <Flex justify="between" css={{ width: '100%', mb: '$2' }}>
        <Text style="subtitle3" color="subtle">
          Item
        </Text>
        <Text style="subtitle3" color="subtle">
          Total
        </Text>
      </Flex>
      <Flex justify="between" align="start" css={{ width: '100%' }}>
        <Flex direction="column">
          <Flex align="center" css={{ gap: '$3' }}>
            <Img
              src={token ? token?.token?.image : collection?.image}
              css={{
                borderRadius: 8,
                objectFit: 'cover',
                height: 56,
                width: 56,
              }}
            />
            <Flex direction="column" css={{ gap: '$1' }}>
              <Text style={'h6'}>
                {token
                  ? token?.token?.name || `#${token?.token?.tokenId}`
                  : collection?.name}
              </Text>
              <Text
                style={'tiny'}
                css={{
                  p: '$1',
                  borderRadius: 4,
                  backgroundColor: '$neutralBgActive',
                  width: 'max-content',
                }}
              >
                {itemCount} {itemSubject}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column" align="end" css={{ gap: '$1', pt: '$1' }}>
          <FormatCryptoCurrency
            chainId={chainId}
            textStyle={'h6'}
            amount={totalPrice}
            address={currency?.address}
            decimals={currency?.decimals}
            symbol={currency?.symbol}
            logoWidth={18}
          />
          {usdTotalFormatted ? (
            <FormatCurrency
              amount={usdTotalFormatted}
              style="subtitle3"
              color="subtle"
              css={{ textAlign: 'end' }}
            />
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )
}
