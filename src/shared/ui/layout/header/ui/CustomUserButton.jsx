import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { Settings } from 'lucide-react'

const CustomUserButton = () => {
  return (
    <div>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action
              label="settings"
              labelIcon={<Settings />}
              open="help"
            />
          </UserButton.MenuItems>

          <UserButton.UserProfilePage
            label="settings"
            labelIcon={<Settings />}
            url="help"
          >
            jiojojio
          </UserButton.UserProfilePage>
        </UserButton>
    </div>
  )
}

export default CustomUserButton