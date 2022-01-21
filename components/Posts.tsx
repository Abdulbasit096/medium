import React from 'react';
import { Post, Props } from '../typings';
import {urlFor} from '../sanity';
import Link from 'next/link';

function Posts({posts} : Props) {
  return (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
    {posts.map((post: Post) => 
      <Link href={`/posts/${post.slug.current}`} key={post._id}>
       <div className='group cursor-pointer border rounded-lg overflow-hidden'>
       <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out " src={urlFor(post.mainImage).url()!} />
        
        <div className="flex justify-between p-5 bg-white">
          <div>
          <p className="font-bold text-lg">{post.title}</p>

          <p className='text-xs'>{post.description} by {post.author.name}</p>
          
            
          </div>
          
        </div>
       </div>
      </Link>
    )}



  </div>);
}

export default Posts;
