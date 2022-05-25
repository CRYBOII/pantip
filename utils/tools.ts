export const convertToTopic = (topic: string): any => {
  const imgReg = /\[IMG\](.*?)\[\/IMG\]/g
  const linkReg = /\[LINK\](.*?)\[\/LINK\]/g

  //   if (!imgReg.test(topic) || !linkReg.test(topic)) return topic

  topic = imgReg.test(topic)
    ? topic.replace(
        imgReg,
        `<img src="$1" alt="" className="w-full object-contain py-3" />
  `
      )
    : topic
  topic = linkReg.test(topic)
    ? topic.replace(
        linkReg,
        `<br/>
    <a
    href="$1"
    className=" text-sm text-blue-500 underline  hover:text-blue-700 py-2"
        >$1</a>
  `
      )
    : topic

  return topic
}
