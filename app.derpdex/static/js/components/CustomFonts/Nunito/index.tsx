import '@fontsource/nunito' // Defaults to weight 400

import styled from 'styled-components'

type SIZECATEGORY = 'xs' | 'sm' | 'md' | 'md2' | 'lg' | 'lg2' | 'xl' | 'xxl' | 'xxxl' | 'x32px' | 'x40px'

interface FontSizeProps {
  size?: SIZECATEGORY
  weight?: number
}

const SIZE_TYPE: { [key: string]: string } = {
  xs: '8px',
  sm: '10px',
  md: '12px',
  md2: '14px',
  lg: '16px',
  lg2: '18px',
  xl: '20px',
  xxl: '24px',
  xxxl: '28px',
  x32px: '32px',
  x40px: '40px',
}

export const NunitoText = styled.div<FontSizeProps>`
  font-family: 'Nunito' !important;
  font-size: ${({ size }) => (size ? SIZE_TYPE[size] : 'inherit')};
  font-weight: ${({ weight }) => (weight ? weight : 'inherit')};
`
