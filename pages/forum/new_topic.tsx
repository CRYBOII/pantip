import { useMutation, useQuery } from '@apollo/client'
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  LinkIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchIcon,
  TagIcon,
} from '@heroicons/react/solid'
import Link from 'next/link'
import React, { useState } from 'react'
import { SEARCH_TAGS } from '../../graphql/quereis'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import useDebounce from '../../utils/custom-hooks/useDebounce'
import { useForm } from 'react-hook-form'
import { Session } from 'next-auth'
import { CREATE_POST } from '../../graphql/mutation'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Model from '../../components/Modal'

type Props = {
  tag?: String
  limit?: Number
  cook: Session
}

type FormData = {
  title: string
  body: string
}
function new_topic({ tag = '', limit = 20, cook }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isLink, setIsLink] = useState<boolean>(true)

  const [search, setSearch] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<any>()
  const [temp, setTemp] = useState<string>('')

  const [creatPost] = useMutation(CREATE_POST)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>()
  // refecthQueries
  useDebounce(() => refetch({ tag: search, limit: 20 }), 200, [search])
  const { data, refetch } = useQuery(SEARCH_TAGS, {
    variables: {
      limit,
      tag,
    },
  })

  const tags: [Tag] = data?.searchTagWithLimit

  const onSubmit = handleSubmit(async (formdata) => {
    if (!selectedTag) {
      return toast.error('กรุณาเลือกเเท็ก สำหรับกระทู้!')
    }
    const notification = toast.loading('กำลังสร้างกระทู้..')
    try {
      let featured = ''
      if (/\[IMG\](.*?)\[\/IMG\]/g.test(formdata.body)) {
        featured = /\[IMG\](.*?)\[\/IMG\]/g.exec(formdata.body)![1]
      }
      const {
        data: { insertPost },
      } = await creatPost({
        variables: {
          title: formdata.title,
          body: formdata.body,
          tag_id: selectedTag.id,
          username: cook?.user?.name,
          email: cook?.user?.email,
          featured: featured,
          profile: `https://avatars.dicebear.com/api/open-peeps/${
            cook?.user?.email || 'placeholder'
          }.svg`,
        },
      })

      setValue('title', '')
      setValue('body', '')
      toast.success('สร้างกระทู้สำเร็จ!', {
        id: notification,
      })
      router.push(`/topic/${insertPost.id}`)
    } catch (error) {
      return toast.error('สร้างกระทู้ไม่สำเร็จ!', {
        id: notification,
      })
    }
  })
  const insertor = (text: string) => {
    const cur_des = getValues('body')
    setValue('body', `${cur_des}\n${text}`)
  }
  return (
    <div>
      {/* Model Editor tool */}
      <Model
        showModal={showModal}
        setShowModal={setShowModal}
        title={isLink ? 'ใส่ลิงก์ลงในกระทู้' : 'อัปโหลดไฟล์รูป'}
      >
        <div className=" flex flex-col space-y-6">
          <input type="text" onChange={(e) => setTemp(e.target.value)} />
          <button
            type="submit"
            className=" rounded-sm border-2 border-violet-800 bg-[#55832e] px-2 py-1 text-sm shadow-inner  shadow-yellow-100 hover:bg-[#50752f]"
            onClick={() => {
              if (
                !/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(
                  temp
                )
              )
                return toast.error('กรุณาใส่ลิงก์ที่ถูกต้อง!')
              const ins = isLink ? `[LINK]${temp}[/LINK]` : `[IMG]${temp}[/IMG]`
              insertor(ins)
              setTemp('')
              setShowModal(false)
            }}
          >
            {isLink ? 'เเทรกลิงค์ลงในกระทู้' : 'เเทรกรูปภาพ'}
          </button>
        </div>
      </Model>
      {/* Navigate tab */}
      <div className=" bg-[#38355c] text-[#a19db6] shadow-sm shadow-gray-900">
        <div className=" mx-auto flex max-w-4xl items-center space-x-3  p-2 font-mono font-thin ">
          <LocationMarkerIcon className=" h-4 w-4" />

          <p className=" cursor-pointer text-sm">ตั้งกระทู้ </p>

          <ChevronRightIcon className=" h-4 w-4 " />
          <p className=" text-sm text-[#62698d]"> ใส่รายละเอียดกระทู้สนทนา</p>
        </div>
      </div>
      {/* Editor container */}
      <form
        onSubmit={onSubmit}
        className=" container mx-auto mt-8   max-w-4xl border-[1px] border-black bg-[#1d3b74]  text-white"
      >
        {/* Title input */}
        <div className=" flex flex-col space-y-3 border-b border-dotted border-[#4164a3]  p-4">
          <p className="text-[13px]">
            1. ระบุหัวข้อกระทู้ของคุณ เช่น ร่วมเสนอไอเดียกันว่าอยากให้
            Pantip.com พัฒนาฟีเจอร์ใหม่อะไรออกมาบ้าง
          </p>
          <input
            {...register('title', { required: true, minLength: 5 })}
            type="text"
            className="  border-2  border-[#3d5e9b] bg-[#335087] px-3 text-[20px] text-yellow-200 shadow-inner outline-orange-300"
            placeholder="หัวข้อกระทู้"
          />
          {errors?.title && (
            <p className="text-[11px] text-yellow-200">
              *กรุณากรอกหัวข้อกระทู้อย่างน้อย 5 ตัวอักษร
            </p>
          )}
        </div>
        {/* Content textarea */}
        <div className="flex flex-col space-y-2 p-4 ">
          <p className="text-[13px]">2. เขียนรายละเอียดของกระทู้</p>
          <div className="bg-[#335087] ">
            <div className="flex space-x-2 border-2 border-b-0 border-[#395a97] p-2 ">
              <button
                type="button"
                className="border-2 border-[#7572aa] bg-[#2e2c4a] p-1"
                onClick={() => {
                  setShowModal(true)
                  setIsLink(true)
                }}
              >
                <LinkIcon className="h-4 w-4 text-[#f8f8f8]" />
              </button>
              <button
                type="button"
                className="border-2 border-[#7572aa] bg-[#2e2c4a] p-1"
                onClick={() => {
                  setShowModal(true)
                  setIsLink(false)
                }}
              >
                <PhotographIcon className="h-4 w-4 text-[#f8f8f8]" />
              </button>
            </div>
            <textarea
              {...register('body', { required: true, minLength: 5 })}
              className="min-h-[500px] w-full border-[2px] border-[#395a97] bg-[#335087] p-2 outline-none"
            ></textarea>
          </div>
          {errors?.body && (
            <p className="text-[11px] text-yellow-200">
              *กรุณาเขียนเนื้อหากระทู้อย่างน้อย 5 ตัวอักษร
            </p>
          )}
        </div>

        <div className=" w-full  border-b-[1px] border-dotted  border-[#4164a3]"></div>
        {/* Tag selecting */}
        <div className=" flex flex-col space-y-5 p-4">
          <p className=" text-[13px]">
            3. เลือกแท็กที่เกี่ยวข้องกับกระทู้ โดย Auto Tag จะคาดเดา Tag
            ที่เกี่ยวข้องกับเนื้อหาในกระทู้นี้ กรุณาเลือก Tag
            ที่เกี่ยวข้องกับเนื้อหากระทู้ของท่านค่ะ{' '}
          </p>
          {selectedTag && (
            <div className=" border border-dotted  p-2">
              <div className=" mx-auto flex max-w-4xl items-center space-x-3  p-2 font-mono font-thin ">
                <TagIcon className=" h-4 w-4" />
                <p className=" cursor-pointer text-sm">เเท็ก </p>
                <ChevronRightIcon className=" h-4 w-4 " />
                <p className=" text-sm text-[#c4c143]">
                  {selectedTag.tag}
                </p>{' '}
                <p
                  className=" cursor-pointer pl-11 text-[11px] hover:text-[#f7f57c]  hover:underline"
                  onClick={() => setSelectedTag('')}
                >
                  ยกเลิก
                </p>
              </div>
            </div>
          )}
          <div className="grid h-[290px] grid-cols-1 gap-1 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <div className="  flex flex-1 items-center  space-x-2  border border-gray-500 bg-[#335087] p-1  text-[12px] shadow-inner">
                <input
                  value={search}
                  type="text"
                  placeholder="ค้นหาบน Pantip"
                  className=" flex-1 bg-transparent outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <SearchIcon className="h-4 w-4 to-gray-400" />
              </div>
              <div className=" flex  h-[250px] flex-col  overflow-y-auto border border-[#1e53b6] text-[13px] text-gray-300">
                {tags?.map((x) => (
                  <div
                    className={` cursor-pointer border border-[#1e53b6] p-1 hover:bg-[#20355e] ${
                      selectedTag === x && 'bg-[#1a2c50]'
                    }  `}
                    onClick={() => setSelectedTag(x)}
                  >
                    {x.tag}
                  </div>
                ))}
              </div>
            </div>
            <div className=" h-full border border-[#1e53b6]"></div>

            <div className=" h-full border border-[#1e53b6]"></div>

            <div className=" h-full border border-[#1e53b6]"></div>
          </div>
        </div>
        <div className=" flex space-x-6 p-4">
          <button
            type="submit"
            className=" rounded-sm border-2 border-violet-800 bg-[#55832e] px-2 py-1 text-sm shadow-inner  shadow-yellow-100 hover:bg-[#50752f]"
          >
            ส่งกระทู้
          </button>
          <div className=" flex items-center space-x-2 text-[12px]">
            <p>ตั้งกระทู้โดย :</p>
            <img
              src={`https://avatars.dicebear.com/api/open-peeps/${
                cook?.user?.email || 'placeholder'
              }.svg`}
              alt=""
              className=" h-5 w-5 border border-gray-400"
            />
            <p>{cook?.user?.name} </p>
          </div>
        </div>
      </form>
    </div>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  // If the user is not logged in, redirect to the login page
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  return {
    props: {
      cook: session,
    },
  }
}
export default new_topic
