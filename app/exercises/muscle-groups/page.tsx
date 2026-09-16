import { useMuscleGroupsContext } from '@/app/providers'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
    const { muscleGroups, setMuscleGroups } = useMuscleGroupsContext();
    // NOT SURE IS THIS PAGE NEEDED AT ALL
    return (
        <div>
            <ul>
                {
                    muscleGroups.map(group => {
                        return (
                            <li
                                key={`muscle_group_${group.id}`}>
                                {group.name}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
