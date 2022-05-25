import { useMutation } from '@apollo/client'
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  LocationMarkerIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import ReactTimeago from 'react-timeago'
import client from '../../apollo-client'
import SideBar from '../../components/SideBar'
import { CREATE_TAG } from '../../graphql/mutation'
import { NextSeo } from 'next-seo'

import {
  GET_EX_POSTS_BY_TAG_ID_LIMIT,
  GET_TAG_BY_NAME,
  SEARCH_TAGS,
} from '../../graphql/quereis'
type Props = {
  posts: [Topic]
  tag: string
  count: number
  username: string
  created_at: Date
}
function PageTag({ posts, tag, count, username, created_at }: Props) {
  const router = useRouter()
  return (
    <div>
      <NextSeo title={`${tag} - Pantip`} />
      <div className=" bg-[#38355c] text-[#a19db6] shadow-sm shadow-gray-900 ">
        <div className=" mx-auto flex max-w-4xl items-center space-x-3  p-2 font-mono font-thin ">
          <ChevronDoubleRightIcon className=" h-4 w-4" />
          <Link href="/tags">
            <p className=" cursor-pointer text-sm">เเท็ก</p>
          </Link>
          <ChevronRightIcon className=" h-4 w-4 " />
          <p className=" text-sm text-[#62698d]">{tag}</p>
        </div>
      </div>

      <div className=" mx-auto mt-7 flex max-w-4xl flex-col space-y-7 px-2 ">
        <div className="  rounded-sm bg-[#2d2a49] p-5 shadow-md">
          <h4 className=" pb-2 text-xl  font-bold text-[#d1ccdf]">{tag}</h4>
          <p className=" text-sm text-[#9e9aa0]">
            {count} กระทู้ - สร้างโดย{' '}
            <span className=" mr-2 text-yellow-500 opacity-50">{username}</span>{' '}
            •
            <span className=" ml-3 text-[12px] opacity-70">
              เมื่อ <ReactTimeago date={created_at} />
            </span>
          </p>
        </div>
        <div className="  flex space-x-6  ">
          <div className="flex-1 rounded-md border-[1px] border-gray-800 bg-[#353156] shadow-md">
            <div className=" flex justify-between border-b border-[#7976a0] bg-[#1f1d33] p-2">
              <p className=" text-yellow-400">กระทู้ล่าสุด</p>
              <p className=" text-[#b39dbb]">ปรับเเต่งเเท็ก</p>
            </div>
            {posts?.map((x) => (
              <div className=" flex  items-center space-x-2 border-b border-[#433f62] p-3 hover:bg-[#2c2a49]">
                {x.featured && (
                  <img src={x.featured} className="h-16 w-16 object-cover" />
                )}
                <div className="">
                  <div
                    className=" flex w-full   cursor-pointer space-x-2"
                    onClick={() => router.push(`/topic/${x.id}`)}
                  >
                    <QuestionMarkCircleIcon className=" mt-1 h-4 w-4  text-yellow-500" />{' '}
                    <p className="  text-sm text-[#d2cde1]">{x.title}</p>
                  </div>
                  <div className=" flex space-x-2 text-[11px] text-[#62698d]">
                    <p>{tag}</p>
                    <p>{tag}</p>
                    <p>{tag}</p>
                  </div>
                  <div className=" text-[13px]">
                    <p className=" text-[#9a99c0]">
                      {x.username}
                      <span className="text-[#747399]">
                        {' '}
                        • <ReactTimeago date={x.created_at} />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SideBar />
        </div>
      </div>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async (context) => {
  const tag = context?.params?.tagname
  const {
    data: { getTagByName },
  } = await client.query({
    query: GET_TAG_BY_NAME,
    variables: { tag: tag },
  })
  if (!getTagByName) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
  const {
    data: { getPostByTagIdWithLimitPaging },
  } = await client.query({
    query: GET_EX_POSTS_BY_TAG_ID_LIMIT,
    variables: { tag_id: getTagByName?.id },
  })
  const posts: [Topic] = getPostByTagIdWithLimitPaging
  return {
    props: {
      posts,
      tag,
      count: getTagByName.count.count,
      username: getTagByName.username,
      created_at: getTagByName.created_at,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60, // In seconds
  }
  // ...
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export default PageTag
