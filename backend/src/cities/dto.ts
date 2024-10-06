import { ApiProperty } from "@nestjs/swagger";

export class CityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    subject: string; 

    @ApiProperty()
    district: string; 

    @ApiProperty()
    population: string; 

    @ApiProperty()
    coords_lat: string; 

    @ApiProperty()
    coords_lon: string; 

    constructor(city: any) {
        this.id = city.id;
        this.name = city.name;
        this.subject = city.subject;
        this.district = city.district;
        this.population = city.population;
        this.coords_lat = city.coords_lat;
        this.coords_lon = city.coords_lon;
    }
}