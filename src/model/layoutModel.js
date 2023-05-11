/**
 * layoutModel.js
 * @description :: model of a database collection of layoutModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");
mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
    {
        landing: {
            title: { type: String },
            backgroundVideo: { type: String },
        },

        mintChecker: {
            cardTitle: { type: String },
            image: { type: String },
            heading: { type: String },
            description: { type: String },
        },

        discord: {
            description: { type: String },
            discordUrl: { type: String },
            video: { type: String },
            firstWinner: { name: { type: String }, logo: { type: String } },
            secondWinner: { name: { type: String }, logo: { type: String } },
            thirdWinner: { name: { type: String }, logo: { type: String } },
        },

        partners: {
            bannerImg: { type: String },
            description: { type: String },
            list: [
                {
                    logo: { type: String },
                    link: { type: String },
                },
            ],
        },
        links: [
            {
                name: { type: String },
                link: { type: String },
            },
        ],

        footerText: { type: String },

        createdAt: { type: Date },

        updatedAt: { type: Date },

        isDeleted: { type: Boolean },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

schema.method("toJSON", function () {
    const { _id, __v, ...object } = this.toObject({ virtuals: true });
    return object;
});

schema.plugin(mongoosePaginate);

const LayoutModel = mongoose.model("layoutModel", schema, "layoutModel");
module.exports = LayoutModel;

