"""Détoure la chemise de la photo Pexels 9558723 : garde le tissu bleu, comble l'épaule tenue par la main, efface le cintre."""
from PIL import Image
import numpy as np
from scipy import ndimage as nd
im=Image.open('big/9558723.jpg').convert('RGB')
a=np.asarray(im).astype(np.float32)/255
al=np.asarray(Image.open('cut/9558723.png').resize(im.size)).astype(np.float32)[...,3]/255
r,g,b=a[...,0],a[...,1],a[...,2]
mx=a.max(-1);mn=a.min(-1);sat=(mx-mn)/np.maximum(mx,1e-3)
blue=(b>r+0.04)&(sat>0.08)&(al>0.3)
lab,n=nd.label(nd.binary_closing(blue,iterations=4))
sizes=nd.sum(np.ones_like(lab),lab,range(1,n+1))
shirt=nd.binary_fill_holes(lab==(np.argmax(sizes)+1))
ys,xs=np.where(shirt); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
a=a[y0:y1+1,x0:x1+1]; shirt=shirt[y0:y1+1,x0:x1+1]; blue=blue[y0:y1+1,x0:x1+1]
H,W=shirt.shape; yy,xx=np.mgrid[0:H,0:W]
# épaule droite : copie miroir de l'épaule gauche autour de la patte de boutonnage
axis=int(W*0.50)
reg=(yy<H*0.30)&(xx>W*0.78)
src_x=np.clip(2*axis-xx,0,W-1)
mir_a=a[yy,src_x]; mir_s=shirt[yy,src_x]
from scipy.spatial import ConvexHull
from PIL import ImageDraw
zone=(yy<H*0.32)&(xx>W*0.55)
pts=np.column_stack(np.where(shirt&zone))[:, ::-1]
hull=pts[ConvexHull(pts).vertices]
poly=Image.new('L',(W,H),0); ImageDraw.Draw(poly).polygon([tuple(p) for p in hull],fill=255)
hole=(np.asarray(poly)>0)&~(shirt&blue)  # l'encoche laissée par la main, comblée par l'enveloppe de l'épaule
ring=nd.binary_dilation(hole,iterations=30)&shirt&blue&~hole
L0=0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
ring&=L0>np.percentile(L0[ring],40)  # le tissu éclairé de l'épaule, pas l'ombre de la manche
col=a[ring].mean(0)
hole=nd.binary_dilation(hole,iterations=2)&(np.asarray(poly)>0)
f=nd.gaussian_filter(hole.astype(np.float32),2)[...,None]
a=a*(1-f)+col*f
shirt=shirt|hole
# cintre noir et lignes sombres du col : remplacés par le tissu voisin
L=0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
bad=nd.binary_dilation((L<0.55)&(yy<H*0.12),iterations=2)&shirt
fab=shirt&~bad
for c in range(3):
    num=nd.gaussian_filter(np.where(fab,a[...,c],0),6); den=nd.gaussian_filter(fab.astype(np.float32),6)
    a[...,c]=np.where(bad,num/np.maximum(den,1e-3),a[...,c])
soft=nd.gaussian_filter(shirt.astype(np.float32),1.2)
o=Image.fromarray((np.dstack([np.clip(a,0,1),soft])*255).astype(np.uint8),'RGBA'); o=o.crop(o.getbbox()); o.save('cut/shirt_full.png'); print(o.size)
bg=Image.new('RGB',o.size,(232,236,240)); bg.paste(o,(0,0),o); bg.thumbnail((500,900)); bg.save('shirtfull.jpg')
