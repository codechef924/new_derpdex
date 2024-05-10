import '@fontsource/gloria-hallelujah' // Defaults to weight 400

import styled from 'styled-components'

type SIZECATEGORY =
  | 'xs'
  | 'sm'
  | 'md'
  | 'md2'
  | 'lg'
  | 'lg2'
  | 'xl'
  | 'xxl'
  | 'xxl2'
  | 'xxxl'
  | 'large40'
  | 'large60'
  | 'large80'

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
  xxl2: '28px',
  xxxl: '32px',
  large40: '40px',
  large60: '60px',
  large80: '80px',
}

export const GloriaText = styled.div<FontSizeProps>`
  font-family: 'Gloria Hallelujah';
  font-size: ${({ size }) => (size && SIZE_TYPE[size] ? SIZE_TYPE[size] : 'inherit')};
  font-weight: ${({ weight }) => (weight ? weight : '400')};
`
