import { gql } from '@apollo/client'

export const CREATE_TAG = gql`
  mutation CreateTag($username: String!, $tag: String!) {
    insertTag(username: $username, tag: $tag) {
      id
      tag
    }
  }
`

export const CREATE_POST = gql`
  mutation CreatePost(
    $username: String!
    $title: String!
    $body: String!
    $featured: String!
    $tag_id: ID!
    $email: String!
    $profile: String!
  ) {
    insertPost(
      username: $username
      title: $title
      body: $body
      featured: $featured
      tag_id: $tag_id
      email: $email
      profile: $profile
    ) {
      id
      title
      body
      featured
      tag_id
      username
      created_at
      email
      profile
    }
  }
`

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $username: String!
    $post_id: String!
    $body: String!
    $email: String!
  ) {
    createComment(
      username: $username
      post_id: $post_id
      body: $body
      email: $email
    ) {
      id
    }
  }
`

export const CREATE_VOTE_BY_ID = gql`
  mutation CreateVoteById($post_id: String!, $email: String!) {
    inserVote(post_id: $post_id, email: $email) {
      id
    }
  }
`
export const DELETE_VOTE_BY_ID = gql`
  query CreateVoteById($post_id: String!, $email: String!) {
    deleteVote(post_id: $post_id, email: $email) {
      id
    }
  }
`
export const CREATE_VOTE_BY_CM_ID = gql`
  mutation CreateVoteById($comment_id: String!, $email: String!) {
    inserVoteComment(comment_id: $comment_id, email: $email) {
      id
    }
  }
`
