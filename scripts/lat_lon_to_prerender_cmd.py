import math


def lat_lon_to_tile(lat, lon, zoom):
    n = 2**zoom
    x_tile = n * ((lon + 180) / 360)
    lat_rad = math.radians(lat)
    y_tile = (
        n * (1 - (math.log(math.tan(lat_rad) + 1 / math.cos(lat_rad)) / math.pi)) / 2
    )
    return int(x_tile), int(y_tile)


for z in [15, 16, 17, 18]:
    zoom = z  # Specify the zoom level
    min_lat, min_lon = 50.75134, 7.06073
    max_lat, max_lon = 50.71695, 7.15206

    min_x, min_y = lat_lon_to_tile(min_lat, min_lon, zoom)
    max_x, max_y = lat_lon_to_tile(max_lat, max_lon, zoom)

    print(
        f"render_list -a -n 8 -z {zoom} -Z {zoom} -x {min_x} -X {max_x} -y {min_y} -Y {max_y}"
    )
