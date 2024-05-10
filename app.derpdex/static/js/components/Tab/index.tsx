/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unused-modules */
import { useState } from 'react'

import * as styles from './index.css'
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabItem = ['Pools', 'My Pool']
export const Tab = ({
  currentTab,
  setCurrentTab,
  tabItem = TabItem,
}: {
  currentTab: string
  setCurrentTab: (tab: string) => void
  tabItem?: string[]
}) => {
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('left')

  return (
    <div className={styles.TabRoot}>
      {tabItem.map((tab, index) => (
        <button
          onClick={() => setCurrentTab(tab)}
          id="tab-item"
          className={`${styles.TabItem} ${currentTab === tab && 'active'} `}
          key={index}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}
