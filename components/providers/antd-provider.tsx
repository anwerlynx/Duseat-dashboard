'use client'

import * as React from 'react'
import { ConfigProvider, App as AntdApp } from 'antd'

export const antdTheme = {
  token: {
    colorPrimary: '#00C2CB', // Duseat Brand Cyan
    colorInfo: '#00C2CB',
    colorSuccess: '#17B26A',
    colorWarning: '#F79009',
    colorError: '#F04438',
    colorTextBase: '#010413',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 38,
      fontWeight: 600,
      colorPrimary: '#00C2CB',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 38,
    },
    DatePicker: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8f8f8',
    },
    Card: {
      borderRadiusLG: 16,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
}

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
