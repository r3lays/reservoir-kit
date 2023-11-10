import React, { FC } from 'react'
import { Box, Button, CryptoCurrencyIcon, Flex, Text } from '../primitives'
import { EnhancedCurrency } from '../hooks/usePaymentTokens'
import { formatUnits } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { formatBN, formatNumber } from '../lib/numbers'
import { CSS } from '@stitches/react'

type Props = {
  paymentTokens?: EnhancedCurrency[]
  setCurrency: (currency: EnhancedCurrency | undefined) => void
  goBack: () => void
  currency?: EnhancedCurrency
  css?: CSS
}

export const SelectPaymentToken: FC<Props> = ({
  paymentTokens,
  setCurrency,
  goBack,
  currency,
  css,
}) => {
  return (
    <Flex
      direction="column"
      css={{ width: '100%', gap: '$1', px: '$3', ...css }}
    >
      {paymentTokens
        ?.sort(
          (a, b) =>
            Number(a.currencyTotalFormatted) - Number(b.currencyTotalFormatted)
        )
        ?.map((paymentToken, idx) => {
          const isSelectedCurrency =
            currency?.address.toLowerCase() === paymentToken?.address &&
            currency?.chainId === paymentToken?.chainId
          const formattedBalance = formatUnits(
            BigInt(paymentToken?.balance || 0),
            paymentToken?.decimals || 18
          )
          if (paymentToken?.currencyTotalRaw != undefined)
            return (
              <Button
                key={idx}
                color="ghost"
                size="none"
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  p: '$2',
                  borderRadius: 4,
                  '&:hover': {
                    background: '$neutralBgHover',
                  },
                  '&:disabled': {
                    background: 'transparent',
                    cursor: 'not-allowed',
                  },
                }}
                onClick={() => {
                  setCurrency(paymentToken)
                  goBack()
                }}
              >
                <Flex
                  align="center"
                  css={{ gap: '$3', opacity: isSelectedCurrency ? 0.5 : 1 }}
                >
                  <CryptoCurrencyIcon
                    address={paymentToken?.address as string}
                    chainId={paymentToken.chainId}
                    css={{ width: 24, height: 24, 'object-fit': 'cover' }}
                  />
                  <Flex direction="column" align="start">
                    <Text style="subtitle2">{paymentToken?.name}</Text>
                    <Text style="body2" color="subtle">
                      Balance: {formatNumber(Number(formattedBalance), 6)}
                    </Text>
                  </Flex>
                </Flex>
                <Flex align="center" css={{ gap: '$3' }}>
                  <Text style="subtitle2">
                    {paymentToken?.currencyTotalRaw
                      ? formatBN(
                          paymentToken?.currencyTotalRaw,
                          6,
                          paymentToken?.decimals
                        )
                      : 0}
                  </Text>
                  {isSelectedCurrency ? (
                    <Box css={{ color: '$accentSolidHover' }}>
                      <FontAwesomeIcon icon={faCheck} width={14} />
                    </Box>
                  ) : null}
                </Flex>
              </Button>
            )
        })}
    </Flex>
  )
}
