<script setup lang="ts">
defineProps(['data', 'category'])
</script>

<template>
    <div class="table-wrapper">
        <h2>{{category}}</h2>

        <table v-if="data" border="1">
            <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>

            <tr v-for="(value, key) in data" :key="key">
                <td>{{ value.name }}</td>
                <td>{{ Number(value.price).toFixed(2) }} $</td>
            </tr>
            </tbody>
        </table>

        <p v-else class="no-data">No data available</p>
    </div>
</template>

<style lang="scss">
.table-wrapper {
    color: #000;
    margin: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    h2 {
        margin-bottom: 20px;
        color: #333;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;

        th,
        td {
            padding: 12px 15px;
            text-align: left;
        }

        th {
            background-color: #007bff;
            color: #fff;
            font-weight: bold;
        }

        tbody {
            tr {
                border-bottom: 1px solid #dddddd;

                &:nth-of-type(even) {
                    background-color: #f9f9f9;
                }

                &:last-of-type {
                    border-bottom: 2px solid #007bff;
                }

                &:hover {
                    background-color: #f1f1f1;
                }
            }
        }
    }

    .no-data {
        text-align: center;
        color: #888;
        font-style: italic;
        margin-top: 20px;
    }
}

</style>
