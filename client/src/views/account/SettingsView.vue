<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'

import TextInput from '@/components/forms/TextInput.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import MultiSelect from 'primevue/multiselect'

const isPremium = ref(false)

const jobTitles = ref('')
const minSalary = ref('')
const location = ref('')
const jobType = ref([])
const locationType = ref([])
const excludedCompanies = ref('')
const autoApply = ref(false)

</script>

<template>
    <div class="my-4 flex flex-column gap-3">
        <Card>
            <template #header>
                <h1 class="heading-md pl-3 pt-2 font-bold">Job Search Preferences</h1>
            </template>

            <template #content>
                <div class="flex flex-column gap-3">
                    <div class="flex flex-column gap-2">
                        <TextInput
                            v-model="jobTitles"
                            label="Job Title(s)"
                            placeholder="e.g. Senior Software Engineer"
                        />
                    </div>

                    <div class="flex flex-column gap-2">
                        <TextInput
                            v-model="minSalary"
                            label="Minimum Salary"
                            placeholder="e.g. 100,000"
                            type="number"
                        />
                    </div>

                    <div class="flex flex-column md:flex-row gap-2">
                        <TextInput
                            v-model="location"
                            label="Location"
                            placeholder="e.g. US, New York, NY"
                        />
                        
                        <div class="flex flex-column gap-2 w-full">
                            <label for="locationType">Location Type</label>
                            <MultiSelect
                                class="w-full"  
                                v-model="locationType"
                                display="chip"
                                placeholder="e.g. remote, hybrid, in-person"
                                :options="['remote', 'hybrid', 'in-person']"
                            />
                        </div>
                    </div>

                    <div class="flex flex-column gap-2">
                        <div class="flex flex-column gap-2">
                            <label for="jobType">Job Type</label>
                            <MultiSelect
                                class="w-full"  
                                v-model="jobType"
                                display="chip"
                                placeholder="e.g. Full Time, Part Time, Contract, etc."
                                :options="['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Temporary', 'Volunteer']"
                            />
                        </div>
                    </div>

                    <div class="flex flex-column gap-2">
                        <TextInput
                            v-model="excludedCompanies"
                            label="Excluded Companies"
                            placeholder="e.g. Google, Apple, Amazon"
                        />
                    </div>

                    <div class="flex flex-column gap-2">
                        <Button>Save</Button>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #header>
                <h1 class="heading-md pl-3 pt-2 font-bold">Additional Filters</h1>
            </template>

            <template #content>
                <div class="flex flex-column gap-2">
                    <label for="autoApply">Auto Apply</label>
                    <ToggleSwitch
                        v-model="autoApply"
                        :disabled="!isPremium"
                    />
                    <p v-if="!isPremium" class="text-sm text-gray-500">
                        Auto apply is only available for premium users.
                    </p>
                </div>
            </template>
        </Card>
    </div>
</template>