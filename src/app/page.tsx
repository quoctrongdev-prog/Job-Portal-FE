'use client';
import CareerGuide from '@/components/career-guide'
import Hero from '@/components/hero'
import ResumeAnalyzer from '@/components/resume-analyser'
import Loading from '@/components/ui/loading'
import { useAppData } from '@/context/AppContext'


const Home = () => {
  //tu context
  const {loading} = useAppData();
  //co loading thi show component Loading (show dang loading)
  if(loading) return <Loading />
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer />
    </div>
  )
}

export default Home