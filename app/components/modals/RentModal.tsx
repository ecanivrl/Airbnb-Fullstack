'use client'

import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/app/hooks/useRentModal'
import Heading from '../Heading'
import { categories } from '../navbar/Categories'
import CategoryInput from '../inputs/CategoryInput'
import {FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/Input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'


enum STEPS  {
  CATEGORY = 0,
  LOCATİON = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRİPTİON = 4,
  PRİCE = 5,
}

const RentModal = () => {
  const router = useRouter()
  const rentModal = useRentModal()

  const [step, setStep] = useState(STEPS.CATEGORY)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
       errors
       }, 
       reset
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',

    }
  })

  const category = watch('category')
  const location = watch('location')
  const guestCount = watch('guestCount')
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount')
  const imageSrc = watch('imageSrc')

  const EcaniMap = useMemo(() => dynamic(() => import('../EcaniMap'),{
    ssr: false,
  }), [location])

  const setCustomValue = (id: string, value: any) => { 
    setValue(id, value,{
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }
  
  const onBack = () => {
   setStep((value) => value - 1)
  }

  const onNext = () => {
    setStep((value) => value + 1)
  }

const onSubmit: SubmitHandler<FieldValues> = async (data) => {
 if (step !== STEPS.PRİCE) {
   return onNext()
 }

  setIsLoading(true)
 
  axios.post('/api/listings', data)
  .then(() => {
    toast.success('Listing created successfully')
    router.refresh()
    reset()
    setStep(STEPS.CATEGORY)
    rentModal.onClose()
  })
  .catch(() => {
    toast.error('Something went wrong')
  }).finally(() => {
    setIsLoading(false)
  })

}


  const actionLabel = useMemo(() => {
   if(step === STEPS.PRİCE){
     return 'Create'
   }

    return 'Next'
  },[step])

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS.CATEGORY){
      return 'undefined'
    }

    return 'Back'
  },[step])


  let bodyContent = (
    <div className="flex flex-col gap-6">
      <Heading
      title='Whic of these best describes your place?'
      subTitle='Pick a category'
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto custom-vertical-scrollbar">
        {categories.map((item) => (
          <div key={item.label} className='col-span-1 pr-1'>
            <CategoryInput
            onClick={(category) =>
               setCustomValue('category', category)}
            selected={category === item.label}
            label={item.label}
            icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  ) 


  if(step === STEPS.LOCATİON){
    bodyContent = (
      <div className='flex flex-col gap-8'>
        <Heading
        title='Where is your place located?'
        subTitle='Help guests find your!'
        />
        <CountrySelect
        value={location}
        onChange={(value) => setCustomValue('location', value)}
        />
        <EcaniMap
        center={location?.latlng}
        />
      </div>
    )
    }

    if(step === STEPS.INFO){
      bodyContent = (
        <div className="flex flex-col gap-8 ">
          <Heading
          title='Share some basics about your place'
          subTitle='What amenities fo you have?'
          />
          <Counter
          title='Guests'
          subTitle='How many guests do you allow?'
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount', value)}
          />
          <hr/>
          <Counter
          title='Rooms'
          subTitle='How many rooms do you have?'
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
          />
          <hr/>
          <Counter
          title='Bathrooms'
          subTitle='How many bathrooms do you have?'
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
          />
        </div>
      )
    }

    if (step === STEPS.IMAGES) {
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="Add a photo of your place"
            subTitle="Show guests what your place looks like!"
          />
          <ImageUpload
            onChange={(value) => setCustomValue('imageSrc', value)}
            value={imageSrc}
          />
        </div>
      )
    }

    if (step === STEPS.DESCRİPTİON){
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="How would you describe your place?"
            subTitle="Short and sweet is best!"
          />
          <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          />
          <hr/>
          <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          />
        </div>
      )
    }

    if (step === STEPS.PRİCE){
       bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
          title='Now set your price'
          subTitle='How much do you  charge per night?'
          />
          <Input
          id='price'
          label='Price'
          formatPrice
          type='number'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          />
        </div>
       )
    }

  return (
    <Modal
    isOpen={rentModal.isOpen}
    onClose={rentModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    actionLabel={actionLabel}
    secondaryActionLabel={secondaryActionLabel}
    secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    title='Airbnb your home!'
    body={bodyContent}
    />
  )
}

export default RentModal