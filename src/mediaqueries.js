import { css } from 'styled-components'

const widthSizes = {
  xxl: 1400,
  xl: 1200,
  lg: 1000,
  md: 775,
  sm: 525,
  xs: 400
}

const heightSizes = {
  xl: 1000,
  lg: 825,
  md: 675,
  sm: 525,
  xs: 400
}

// Iterate through the sizes and create a media template
const media = {
    portrait: Object.keys(widthSizes).reduce((acc, label) => {
        acc[label] = (...args) => css`
          @media (max-width: ${widthSizes[label]}px) and (orientation: portrait){
            ${css(...args)}
          }
        `
        return acc
      }, 
    {}),
    landscape: Object.keys(heightSizes).reduce((acc, label) => {
        acc[label] = (...args) => css`
          @media (max-height: ${heightSizes[label]}px) and (orientation: landscape){
            ${css(...args)}
          }
        `
        return acc
      }, 
    {}),
    both: Object.keys(widthSizes).reduce((acc, label) => {
        acc[label] = (...args) => css`
          @media (max-width: ${widthSizes[label]}px){
            ${css(...args)}
          }
        `
        return acc
      }, 
    {}),  
}

export default media