select brd.brand_name, brd.cuisine_type, brd.price_scale, loc.latitude, loc.longitude from brand as brd
join location as loc
on brd.brand_id = loc.FK_brand_id;