'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="navbar bg-base-100 p-5">
            <div className="flex-1">
                <Link href="/">
                    <Image src="/logo.webp" alt="Logo" width={50} height={50} priority />
                </Link>
            </div>
            <div className="flex-none gap-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-24 md:w-auto"
                />

                {status === 'loading' ? (
                    <p>Loading...</p>
                ) : session?.user ? (
                    <div className="flex items-center gap-3">
                        <p className="font-bold">{session.user.username}</p>
                        <Button
                        className='w-20 h-12 bg-gray-800'
                            onClick={() => signOut()}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href={'/login'}>
                <Button className='w-20 h-12 bg-gray-800'>
                    Login
                </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
