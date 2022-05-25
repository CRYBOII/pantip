import {
  LocationMarkerIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid'
import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { type } from 'os'
import ReactTimeago from 'react-timeago'
import client from '../apollo-client'
import SideBar from '../components/SideBar'
import { GET_POST_WITH_LIMIT } from '../graphql/quereis'
type Props = {
  posts: [Topic]
}
const Home: NextPage = ({ posts }: any) => {
  const router = useRouter()

  return (
    <div className="  mx-auto mt-5 max-w-4xl">
      <div className="  flex space-x-6  ">
        <div className="flex-1 rounded-md border-[1px] border-gray-800 bg-[#353156] shadow-md">
          <div className=" flex justify-between border-b border-[#7976a0] bg-[#1f1d33] p-2">
            <p className=" text-yellow-400">กระทู้ล่าสุด</p>
            <p className=" text-[#b39dbb]">ปรับเเต่งเเท็ก</p>
          </div>
          {posts?.map((x: any) => (
            <div
              className=" flex  items-center space-x-2 border-b border-[#433f62] p-3 hover:bg-[#2c2a49]"
              onClick={() => router.push(`/topic/${x.id}`)}
            >
              {x.featured && (
                <img
                  src={x.featured}
                  className="h-16 w-16 cursor-pointer object-cover"
                />
              )}
              <div className="">
                <div className=" flex w-full   cursor-pointer space-x-2">
                  <QuestionMarkCircleIcon className=" mt-1 h-4 w-4  text-yellow-500" />{' '}
                  <p className="  text-sm text-[#d2cde1]">{x.title}</p>
                </div>
                <div className=" flex space-x-2 text-[11px] text-[#62698d]">
                  <p>{x.tag.tag}</p>
                  <p>{x.tag.tag}</p>
                  <p>{x.tag.tag}</p>
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
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    data: { getPostWithLimit },
  } = await client.query({
    query: GET_POST_WITH_LIMIT,
  })
  const posts: [Topic] = getPostWithLimit
  return {
    props: { posts },
  }
}

export default Home
