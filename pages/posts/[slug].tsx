import { GetStaticProps } from "next";
import React, { useState } from "react";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Comment, FormInput, Post, Props, SinglePost } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";

function Post({ post }: SinglePost) {
  console.log(post);
  const [submitted , setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    
   try {
     const comment = await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setSubmitted(true)
   } catch (error) {
     setSubmitted(false)
     console.log(error);
   }
  };

  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        className="w-full h-40 object-cover"
        alt=""
      />
      <article className="p-5 sm:p-0 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center space-x-2 mt-4">
          <p className="font-extralight text-sm">
            Blog Post by{" "}
            <span className="text-green-600">{post.author.name}</span> Published
            at {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            content={post.body}
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {
        submitted ? <div className="max-w-2xl mx-auto my-10 p-10 bg-yellow-500 text-white flex flex-col">
          <h1 className="text-3xl font-bold">Your Comment is submitted</h1>
          <p>It will apear below once it's approved.</p>
        </div> : 
        
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
      >
        <h3 className="text-sm text-yellow-500">Enjoyed the article ?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below</h4>
        <hr className="py-3 mt-2" />

        <input {...register("_id")} type="hidden" name="_id" value={post._id} />

        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          <input
            {...register("name", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none focus:ring ring-yellow-500"
            placeholder="Abdul Basit"
            type="text"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input
            {...register("email", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none focus:ring ring-yellow-500"
            placeholder="basit@ab.com"
            type="email"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register("comment", { required: true })}
            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none focus:ring ring-yellow-500"
            placeholder="Your Comment"
            rows={8}
          />
        </label>
        <div className="flex flex-col p-5">
          {errors.name && (
            <span className="text-red-500">The name is required</span>
          )}
          {errors.email && (
            <span className="text-red-500">The Email is required</span>
          )}
          {errors.comment && (
            <span className="text-red-500">Comment is required</span>
          )}
        </div>
        <input
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 focus:shadow focus:outline-none text-white px-4 py-2 rounded cursor-pointer"
        />
      </form>}
<div className="flex flex-col p-5 max-w-2xl mx-auto mb-10 border bg-white shadow shadow-yellow-400">
  <h1 className='font-bold text-2xl'>{post.comments.length > 1 ? `${post.comments.length} Comments` : `${post.comments.length} Comment`}</h1>
  {post.comments.map((comment : Comment) => (
    <p className='text-sm mt-4 text-gray-500'>
      <span className='font-bold text-black text-sm'>{comment.name} </span>
      {comment.comment}
    </p>
  ))}
</div>


    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
    _id,
   
  slug{
    current
  }
   
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
        _id,
        title,
        author -> {
        name,
        image
      },
      'comments' : *[
        _type == 'comment' &&
        post._ref == ^._id &&
        approved == true
      ],
      mainImage,
      description,
      _createdAt,
       body,
      slug{
        current
      }
       
      }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};