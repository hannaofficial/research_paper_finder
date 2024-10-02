import Skeleton from 'react-loading-skeleton';



const loadingHome = () => {
  return (
    <div className='flex gap-2'>
      <div className='border border-neutral-600'>
        <Skeleton height={380} width={320}  />
      </div>
      <div className='border border-neutral-600'>
        <Skeleton height={380} width={320}  />
      </div>
      <div className='border border-neutral-600'>
        <Skeleton height={380} width={320}  />
      </div>
    </div>
  )
}

export default loadingHome
