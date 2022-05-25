import { useMutation, useQuery } from '@apollo/client'
import { SearchIcon } from '@heroicons/react/outline'
import { LocationMarkerIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import client from '../apollo-client'
import { CREATE_TAG } from '../graphql/mutation'
import { GET_TAGS_LIST, GET_TAG_BY_NAME } from '../graphql/quereis'
import TimeAgo from 'react-timeago'
import Link from 'next/link'

type FormData = {
  create_tag: string
}
function tags() {
  const { data: session } = useSession()

  const { data } = useQuery(GET_TAGS_LIST)

  const [left, setLeft] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const [createTag] = useMutation(CREATE_TAG, {
    refetchQueries: [GET_TAGS_LIST],
  })
  // When the user submits the form, we want to create a new tag
  const onSubmit = handleSubmit(async (formdata) => {
    console.log(formdata)
    const notification = toast.loading('กำลังสร้างเเท็ก..')

    try {
      const {
        data: { getTagByName },
      } = await client.query({
        query: GET_TAG_BY_NAME,
        variables: {
          tag: formdata.create_tag,
        },
      })

      if (!getTagByName) {
        const {
          data: { insertTag },
        } = await createTag({
          variables: {
            tag: formdata.create_tag,
            username: session?.user?.name,
          },
        })
        setValue('create_tag', '')
        return toast.success('สร้างเเท็กสำเร็จ!', {
          id: notification,
        })
      }

      return toast.error('เเท็กนี่้ถูกสร้างไปเเล้ว!', {
        id: notification,
      })
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดบ้างประการ', {
        id: notification,
      })
    }
  })

  const tags: [Tag] = data?.getTagList
  return (
    <div>
      <div className=" textV bg-[#38355c] shadow-sm shadow-gray-900">
        <div className=" mx-auto flex max-w-4xl items-center space-x-3  p-2 font-mono font-thin ">
          <LocationMarkerIcon className=" h-4 w-4" />
          <p className=" text-sm">เเท็ก</p>
        </div>
      </div>
      <div className="textV container mx-auto mt-8 flex max-w-4xl flex-col px-2 ">
        <div className="flex items-center space-x-3 border border-gray-900 bg-[#38355c] p-2 text-sm shadow-sm">
          <p> ค้นหาเเท็ก</p>
          <div className="  flex flex-1 items-center  space-x-2  border-r border-gray-900 bg-[#44416f] p-1  shadow-inner">
            <input
              type="text"
              placeholder="ค้นหาบน Pantip"
              className=" flex-1 bg-transparent outline-none"
            />
            <SearchIcon className="h-4 w-4 to-gray-400" />
          </div>
        </div>

        <div className={`px mt-6  bg-[#1f1d33]   text-sm`}>
          <div className=" flex ">
            <p
              className={`${
                left ? 'border-t-2 border-yellow-300 bg-[#2d2a49]' : 'border'
              }  cursor-pointer border-gray-900  p-2`}
              onClick={() => setLeft(true)}
            >
              สร้างเเท็ก
            </p>
            <p
              className={`${
                !left
                  ? 'border-t-2 border-yellow-300 bg-[#2d2a49]  shadow-inner'
                  : 'border'
              }  cursor-pointer border-gray-900  p-2`}
              onClick={() => setLeft(false)}
            >
              เเท็กทั้งหมด
            </p>
            <div className=" flex-1  border border-gray-900"></div>
          </div>
          <div className=" min-h-[500px] border  border-t-0 border-gray-900 bg-[#2d2a49]">
            {left ? (
              <form onSubmit={onSubmit} className=" flex space-x-2 p-8">
                <div className="  flex flex-1 items-center  space-x-2  border-r border-gray-900 bg-[#44416f] p-1  shadow-inner">
                  <input
                    type="text"
                    {...register('create_tag', {
                      required: true,
                    })}
                    disabled={!session}
                    placeholder={session ? 'สร้างเเท็ก' : 'กรุณาเข้าสู่ระบบ'}
                    className=" flex-1 bg-transparent px-3 outline-none"
                  />
                </div>
                <button
                  className=" w-[100px] rounded-sm bg-[#201d35] px-5 text-yellow-500 shadow-sm"
                  disabled={!watch('create_tag') || !session}
                >
                  สร้าง
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {tags?.map(({ tag, username, created_at }) => (
                  <div className="w-full border-b-[1px] border-r-[1px] border-[#38355c] p-4">
                    <Link href={`/tag/${tag}`}>
                      <button className=" border-white bg-gray-300 px-1 text-[13px] text-black">
                        {tag}
                      </button>
                    </Link>
                    <div className=" flex justify-between pt-2 text-[11px] text-[#565283]">
                      <p>
                        สร้างโดย{' '}
                        <span className=" text-[#706533]">{username}</span>
                        {'  '} เมื่อ {'  '}{' '}
                        <span className=" text-[10px]">
                          <TimeAgo date={created_at} />{' '}
                        </span>
                      </p>
                      <button className=" rounded-sm bg-[#7459c8] px-3 text-white">
                        ติดตาม
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default tags
