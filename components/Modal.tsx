import { XCircleIcon } from '@heroicons/react/solid'
import React, { useEffect, useRef } from 'react'

function Modal({ children, showModal, setShowModal, title }: any) {
  console.log(showModal)

  const ref = useRef<any>(null)

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 top-[50vh] z-50  flex justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none  ">
          <div
            className="sticky my-6 mx-auto  h-fit w-full max-w-lg  border-2 border-gray-500"
            ref={ref}
          >
            <div className=" flex  items-center justify-between bg-[#25223c] p-1 ">
              <p className="text-white">{title ?? ''}</p>
              <XCircleIcon
                className=" h-5 w-5 cursor-pointer text-gray-500"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className=" bg-[#3f3e68] p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
