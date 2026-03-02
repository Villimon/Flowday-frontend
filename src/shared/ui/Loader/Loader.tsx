import { FC } from 'react'
import cls from './Loader.module.css'
import clsx from 'clsx'

interface LoaderProps {
    className?: string
}

export const Loader: FC<LoaderProps> = ({ className }) => (
    <div className={clsx(cls['loader-wrapper'], {}, [className])}>
        <div className={clsx(cls['lds-ring'], {}, [className])}>
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
)
