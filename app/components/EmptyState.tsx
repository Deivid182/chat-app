
const EmptyState = () => {
  return (
    <div 
      className='
      px-4 
      py-10 
      sm:px-6
      lg:px-8
      lg:py-6
      h-full
      flex
      justify-center
      items-center
      bg-gray-100
      '
    >
      <div className='flex flex-col items-center text-center'>
        <h3 className='mt-2 text-2xl font-bold text-gray-900'>
          Select a chat or start a conversation
        </h3>
      </div>
    </div>
  )
}

export default EmptyState
