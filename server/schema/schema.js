const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  buildSchema,
  GraphQLError,
  GraphQLInt,
} = require("graphql");
const Songs = require("../models/songsModel.js");
const Artist = require("../models/artistsModel.js");
const Album = require("../models/albumsModel.js");
const Attractions = require("../models/attractionsModel.js");
const Cities = require("../models/citiesModel.js");
const Countries = require("../models/countriesModel.js");

//TYPE DEFS
//THIS IS JUST ALL MOCK DATA AND MOCK TYPES
//ALTERNATIVELY IN THE RESOLVER CHOOSE THE DB OF YOUR LIKING
//WE USED MONGODB FOR TESTING PURPOSES BUT PSQL MAYBE BETTER!

let elapsedTime = {};

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(AlbumType),
      // a resolver function is responsible for return data for a specific field
      // this is where we can grab the specific timing for the field
      resolve(parent, args) {
        const startTime = new Date().getTime();
        return Album.find({ artist: parent.name }).then((result) => {
          // console.log(result);
          const endTime = new Date().getTime();
          elapsedTime.albums = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.albums, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});

const AlbumType = new GraphQLObjectType({
  name: "Album",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
    songs: {
      type: new GraphQLList(SongType),
      resolve(parent, args) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Songs.find({ album: parentName }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.songs = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.songs, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});

const AttractionsType = new GraphQLObjectType({
  name: "Attractions",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    city: { type: GraphQLString },
    country: {
      type: CountryType,
      resolve(parent, args) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Cities.findOne({ city: parent.city })
          .then((city) => Countries.findOne({ country: city.country }))
          .then((result) => {
            const endTime = new Date().getTime();
            elapsedTime.country = endTime - startTime;
            console.log("elapsedTime: ", elapsedTime.country, "ms");
            // console.log(result);
            return result;
          });
      },
    },
  }),
});

const CityType = new GraphQLObjectType({
  name: "City",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    attractions: {
      type: new GraphQLList(AttractionsType),
      resolve(parent, args) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Attractions.find({ city: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.attractions = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.attractions, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});

const CountryType = new GraphQLObjectType({
  name: "Country",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cities: {
      type: new GraphQLList(CityType),
      async resolve(parent, args) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Cities.find({ country: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.cities = endTime - startTime;
          console.log("elapsedTime.cities: ", elapsedTime.cities, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});

const SongType = new GraphQLObjectType({
  name: "Song",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: ArtistType },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    song: {
      type: SongType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const song = Songs.findOne({ name: args.name });
        return song;
      },
    },
    album: {
      type: AlbumType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const album = Album.findOne({ name: args.name });
        return album;
      },
    },
    artist: {
      type: ArtistType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const artist = await Artist.findOne({ name: args.name });
        return artist;
      },
    },
    country: {
      type: CountryType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const country = await Countries.findOne({ name: args.name });
        return country;
      },
    },
    city: {
      type: CityType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const city = await Cities.findOne({ name: args.name });
        return city;
      },
    },
    attractions: {
      type: AttractionsType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const attractions = await Attractions.findOne({ name: args.name });
        return attractions;
      },
    },
  },
});

const RootMutations = new GraphQLObjectType({
  name: "RootMutationsType",
  fields: {
    addSong: {
      type: SongType,
      args: {
        name: { type: GraphQLString },
        album: { type: GraphQLString },
        artist: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const song = await Songs.create({
          name: args.name,
          album: args.album,
          artist: args.artist,
        });
        return song;
      },
    },
    addAttraction: {
      type: AttractionsType,
      args: { name: { type: GraphQLString }, city: { type: GraphQLString } },
      async resolve(parent, args) {
        const checkCity = await Cities.findOne({ name: args.city });
        if (checkCity) {
          const newAttraction = await Attractions.create({
            name: args.name,
            city: args.city,
          });
          return newAttraction;
        } else {
          throw new Error(
            `City not found in database, add city and country first.`,
            {
              code: "COST_LIMIT_EXCEEDED",
              http: { status: 406 },
            }
          );
        }
      },
    },
    addCity: {
      type: CityType,
      args: { name: { type: GraphQLString }, country: { type: GraphQLString } },
      async resolve(parent, args) {
        const checkCountry = await Countries.findOne({ name: args.country });
        if (checkCountry) {
          const newCity = await Cities.create({
            name: args.name,
            country: args.country,
          });
          return newCity;
        }
      },
    },
    editCity: {
      type: CityType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { id, name, country } = args;
        const checkCountry = await Countries.findOne({ name: country });
        if (!checkCountry) {
          throw new Error("Country not found");
        }
        const updatedCity = await Cities.findOneAndUpdate(
          { _id: id },
          { $set: { name, country } },
          { new: true }
        );
        return updatedCity;
      },
    },
    // editCity: {
    //   type: CityType,
    //   args: { id: { type: GraphQLID }, name: { type: GraphQLString }, country: { type: GraphQLString } },
    //   async resolve(parent, args) {
    //     const updatedCity = await Cities.findByIdAndUpdate(
    //       args.id,
    //       { name: args.name, country: args.country },
    //       { new: true }
    //     );

    //     return updatedCity;
    //   },
    deleteCity: {
      type: CityType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log({ args });
        console.log({ parent });
        const findCity = await Cities.findOne({ _id: args.id });
        console.log({ findCity });
        if (findCity) {
          await Cities.deleteOne({ _id: args.id });
        }
      },
    },
    addCountry: {
      type: CountryType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const country = await Countries.create({ name: args.name });
        return country;
      },
    },
  },
});

const getElapsedTime = (req, res, next) => {
  console.log("elapsed time in mid: ", elapsedTime);
  res.locals.time = elapsedTime;
  return next();
};

const clearElapsedTime = (req, res, next) => {
  elapsedTime = {};
  console.log(elapsedTime);
  return next();
};

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
  types: [ArtistType, AlbumType, SongType],
});

module.exports = {
  clearElapsedTime,
  getElapsedTime,
  graphqlSchema,
};
