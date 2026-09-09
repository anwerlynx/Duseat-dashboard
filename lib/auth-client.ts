'use client'

import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()

export const { signUp, signIn, signOut, useSession, useListSessions, forgetPassword, resetPassword, verifyEmail, resendVerificationEmail, updateUser, changePassword, twoFactor, passkey, organization, account, device, user } = (authClient as any)
