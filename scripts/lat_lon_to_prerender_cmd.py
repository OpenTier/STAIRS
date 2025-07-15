# Copyright (c) 2025 by OpenTier GmbH
# SPDX-FileCopyrightText: 2025 OpenTier GmbH
# SPDX-License-Identifier: LGPL-3.0-or-later

# This file is part of OpenTier.

# This is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.

# This is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.

# You should have received a copy of the GNU Lesser General Public
# License along with this file.  If not, see <https://www.gnu.org/licenses/>.

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
