-- Les rendus 3D laissent la place à de vraies photos : public/photos/<modèle>.jpg (sources dans CREDITS.md).
update public.products set image_url = '/photos/' || model || '.jpg' where image_url like '/renders/%';
