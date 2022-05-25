import { gql } from '@apollo/client'

export const GET_TAGS_LIST = gql`
  query MyQuery {
    getTagList {
      id
      tag
      created_at
      username
    }
  }
`

export const GET_TAG_BY_NAME = gql`
  query MyQuery($tag: String!) {
    getTagByName(tag: $tag) {
      id
      tag
      created_at
      username
      count {
        count
      }
    }
  }
`

export const SEARCH_TAGS = gql`
  query MyQuery($tag: String!, $limit: Int!) {
    searchTagWithLimit(tag: $tag, limit: $limit) {
      tag
      id
    }
  }
`

export const CREATE_TAG = gql`
  mutation CreateTag($username: String!, $tag: String!) {
    insertTag(username: $username, tag: $tag) {
      id
      tag
    }
  }
`

export const DELETE_TAG = gql`
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id) {
      id
      tag
    }
  }
`

export const GET_POST_BY_ID = gql`
  query MyQuery($id: String!) {
    getPostById(id: $id) {
      created_at
      featured
      tag_id
      profile
      id
      username
      title
      body
      email
      tag {
        tag
      }
      comments {
        id
        body
        created_at
        email
        votes {
          email
          id
        }

        username
      }
      votes {
        email
      }
    }
  }
`

export const GET_EX_POSTS_BY_TAG_ID_LIMIT = gql`
  query MyQuery($tag_id: String!, $first: Int = 10, $after: Int = 0) {
    getPostByTagIdWithLimitPaging(
      tag_id: $tag_id
      first: $first
      after: $after
    ) {
      featured
      id
      title
      username
      created_at
    }
  }
`

export const GET_POST_WITH_LIMIT = gql`
  query MyQuery($limit: Int = 20) {
    getPostWithLimit(limit: $limit) {
      featured
      id
      title
      username
      created_at
      tag {
        tag
      }
    }
  }
`
