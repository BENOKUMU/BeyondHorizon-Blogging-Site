import React from 'react'
import InputBox from '../components/input.component'

const UserAuthForm = ({ type }) => {
  return (
    <section className="h-cover flex items-center justify-center">
        <form action="" className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                { type == "sign-in" ? "Welcome back" : "Join us Today" }
            </h1>

            {
                type != "sign-in" ?
                <InputBox 
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    icon="fi-rs-user"
                />
                : ""
            }
            <InputBox 
                name="email"
                type="email"
                placeholder="Email"
                icon="fi-rr-envelopes"
            />
            <InputBox 
                name="password"
                type="password"
                placeholder="Password"
                icon="fi-rr-key"
            />

            <button
                className='btn-dark centre mt-14'
                type='submit'
            >
                { type.replace("-", " ") }
            </button>

            <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                <hr className='w-1/2 border-black' />
                <hr className='w-1/2 border-black' />
            </div>
        </form>
    </section>
  )
}

export default UserAuthForm