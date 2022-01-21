export interface Post {
  title: string;
  _id: string;
  _createdAt: string;
  description: string;
  author: {
    name: string;
    
  };
  mainImage: {
    asset: {
      url: string;
    };
  };
  comments: [Comment];
  slug: {
    current: string;
  };
  body: [object];
}

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

export interface Props {
  posts: [Post];
}

export interface SinglePost {
  post: Post;
}

export interface FormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
