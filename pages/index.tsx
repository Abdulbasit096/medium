import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Posts from '../components/Posts'
import {sanityClient , urlFor} from '../sanity';
import {Props } from '../typings';


export default function Home({posts} : Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Header/>
      <Banner/>
      <Posts posts = {posts}/>
    </div>
  )
}


export const  getServerSideProps = async ()=>{
  const query = `*[_type == 'post']{
    _id,
    title,
    slug,
    _createdAt,
    mainImage,
    description,
    author -> {
    name,
    image 
  }
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts
    }
  }

}