'use client';

import Image from 'next/image';

import useCountries from '@/app/hooks/useCountries';
import { SafeUser } from '@/app/types';

import HeartButton from '../HeartButton';
import Heading from '../Heading';

interface ListingHeadProps {
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    locationValue,
    imageSrc,
    id,
    currentUser,
}) => {

    const {getByValue} = useCountries()

    const location = getByValue(locationValue)

  return (
    <>
     <Heading
     title={title}
     subTitle={`${location?.region}, ${location?.label}`}
     />
     <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
        alt="Image"
        src={imageSrc}
        fill
        className='object-cover object-center w-full'
        />
        <div className="absolute top-5 right-5">
          <HeartButton
          listingId={id}
          currentUser={currentUser}
          />
        </div>
     </div>
    </>
  )
}

export default ListingHead