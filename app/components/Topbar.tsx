'use client';
import { Button } from '@/components/ui/button';
import { ChevronUp, DoorOpen, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { profileDropdown } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

export default function Topbar() {
  const pathname = usePathname();
  const [userProfileImage, setUserProfileImage] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const { logout, user } = useAuth();

  const title =
    pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, '')
      .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Dashboard';

  const handleLogout = async (value: string) => {
    if (value == 'yes') {
      await logout();
      setLogoutDialog(false);
    } else if (value == 'no') {
      setLogoutDialog(false);
    }
  };
  return (
    <>
      <div
        className="flex justify-between items-center px-3 h-15 glass border-r border-white/[0.06]"
        style={{ background: 'rgba(12, 12, 20, 0.97)' }}
      >
        <h1 className="font-bold text-2xl">{title}</h1>
        <Button onClick={() => setDropDown(!dropDown)}>
          <div className="rounded-full p-1 border border-gray-400 text-gray-400">
            {!userProfileImage ? (
              <User />
            ) : (
              <Image width={30} height={30} alt="Profile" src={`${''}`} />
            )}
          </div>
        </Button>
      </div>

      {/* Dropdown */}
      <div className={`${!dropDown ? 'hidden' : 'block'} absolute right-6 top-13 w-fit z-40`}>
        <div
          className={` w-20 px-4 border rounded-md border-gray-600 w-50 py-3`}
          style={{ background: 'rgba(12, 12, 20, 0.98)' }}
        >
          {profileDropdown.map((item) => {
            return (
              <Link
                onClick={() => setDropDown(false)}
                key={item.href}
                href={item.href}
                className={`sidebar-item`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />

                <span className={`flex-1`}>{item.label}</span>
                {/* {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />} */}
              </Link>
            );
          })}
          <Button
            className="text-gray-400 gap-4"
            onClick={() => {
              setDropDown(false);
              setLogoutDialog(true);
            }}
          >
            <DoorOpen className="w-4 h-4 flex-shrink-0 " />
            Logout
          </Button>
        </div>
        <ChevronUp className="absolute right-0 top-[-15]" color={'gray'} />
      </div>

      {/* Loguot Dialobox */}

      <div
        className={`z-40 ${logoutDialog ? 'block' : 'hidden'} flex absolute top-55 px-5 md:absolute md:top-80 md:left-40 lg:absolute lg:top-90 lg:left-170 lg:right-0`}
      >
        <div className="fixed"></div>
        <div className="text-gray-400 gap-8 bg-gray-900 flex flex-col justify-center items-center w-84 md:w-150 h-60 border border-gray-600 rounded-lg px-5 py-4">
          <p className="text-2xl font-bold">Are you sure ?</p>
          {/* Button */}
          <div className="flex gap-8">
            <Button
              className="bg-red-500 w-20 text-white font-bold"
              onClick={() => handleLogout('yes')}
            >
              Yes
            </Button>
            <Button className="bg-gray-500 text-white font-bold" onClick={() => handleLogout('no')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
